from __future__ import annotations

from datetime import datetime
from typing import Generator, List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session, joinedload

from config import ALLOWED_ORIGINS, load_dev_users
from database import CommentModel, PostModel, SessionLocal, UserModel, get_db, init_db

init_db()

app = FastAPI(title="ScienceHub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserPayload(BaseModel):
    name: str = Field(..., min_length=3, description="Imię i nazwisko użytkownika")
    title: str = Field(..., min_length=3, description="Tytuł naukowy użytkownika")
    bio: str = Field(..., min_length=10, description="Krótki opis naukowca")
    institution: str = Field(..., min_length=3, description="Instytucja, z którą związany jest użytkownik")
    avatar: str | None = Field(default=None, description="Adres URL do zdjęcia profilowego")
    publications: int = Field(default=0, ge=0)
    followers: int = Field(default=0, ge=0)
    following: int = Field(default=0, ge=0)


class UserResponse(UserPayload):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UserUpdatePayload(BaseModel):
    name: str | None = Field(default=None, min_length=3)
    title: str | None = Field(default=None, min_length=3)
    bio: str | None = Field(default=None, min_length=10)
    institution: str | None = Field(default=None, min_length=3)
    avatar: str | None = None
    publications: int | None = Field(default=None, ge=0)
    followers: int | None = Field(default=None, ge=0)
    following: int | None = Field(default=None, ge=0)


class CommentPayload(BaseModel):
    author_id: int = Field(..., ge=1)
    content: str = Field(..., min_length=3)


class CommentResponse(BaseModel):
    id: int
    author: UserResponse
    content: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class PostPayload(BaseModel):
    author_id: int = Field(..., ge=1)
    content: str = Field(..., min_length=5)
    tags: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)


class PostUpdatePayload(BaseModel):
    content: str = Field(..., min_length=5)
    tags: List[str] = Field(default_factory=list)


class LikePayload(BaseModel):
    direction: str = Field(..., pattern="^(like|unlike)$")


class SharePayload(BaseModel):
    increment: bool = True


class PostResponse(BaseModel):
    id: int
    author: UserResponse
    content: str
    timestamp: datetime
    likes: int
    shares: int
    tags: List[str]
    images: List[str]
    comments: List[CommentResponse]

    model_config = ConfigDict(from_attributes=True)


def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def load_post_with_relations(db: Session, post_id: int) -> PostModel:
    post = (
        db.query(PostModel)
        .options(
            joinedload(PostModel.author),
            joinedload(PostModel.comments).joinedload(CommentModel.author),
        )
        .filter(PostModel.id == post_id)
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post nie istnieje")
    return post


def serialize_post(post: PostModel) -> PostResponse:
    return PostResponse(
        id=post.id,
        author=UserResponse.from_orm(post.author),
        content=post.content,
        timestamp=post.timestamp,
        likes=post.likes,
        shares=post.shares,
        tags=post.tags or [],
        images=post.images or [],
        comments=[
            CommentResponse(
                id=comment.id,
                author=UserResponse.from_orm(comment.author),
                content=comment.content,
                timestamp=comment.timestamp,
            )
            for comment in sorted(post.comments, key=lambda c: c.timestamp, reverse=True)
        ],
    )


def seed_database(db: Session) -> None:
    if db.query(UserModel).count() > 0:
        return

    users_seed = [
        {
            "name": "Dr Anna Kowalska",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            "title": "Profesor Fizyki Kwantowej",
            "bio": "Specjalistka od splątania kwantowego i edukatorka naukowa.",
            "institution": "Uniwersytet Warszawski",
            "publications": 47,
            "followers": 1250,
            "following": 320,
        },
        {
            "name": "Prof. Jan Nowak",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
            "title": "Kierownik Katedry Biotechnologii",
            "bio": "Badacz w dziedzinie biotechnologii i inżynierii genetycznej.",
            "institution": "Politechnika Gdańska",
            "publications": 89,
            "followers": 2100,
            "following": 450,
        },
        {
            "name": "Dr Katarzyna Wiśniewska",
            "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            "title": "Badaczka AI i Machine Learning",
            "bio": "Tworzy modele AI do przewidywania zmian klimatu.",
            "institution": "AGH Kraków",
            "publications": 34,
            "followers": 980,
            "following": 210,
        },
    ]

    user_entities = [UserModel(**user) for user in users_seed]
    db.add_all(user_entities)
    db.flush()

    posts_seed = [
        {
            "author_id": user_entities[0].id,
            "content": "Najnowsze odkrycia w dziedzinie splątania kwantowego wskazują na 40% poprawę efektywności obliczeń.",
            "timestamp": datetime.fromisoformat("2024-11-15T10:30:00"),
            "likes": 127,
            "shares": 23,
            "tags": ["Fizyka Kwantowa", "Badania", "Technologia"],
            "images": [
                "https://images.unsplash.com/photo-1755455840466-85747052a634?auto=format&w=1080",
            ],
        },
        {
            "author_id": user_entities[1].id,
            "content": "Przełomowe wyniki terapii genowej CRISPR-Cas9 opublikowane w Nature.",
            "timestamp": datetime.fromisoformat("2024-11-14T14:20:00"),
            "likes": 243,
            "shares": 56,
            "tags": ["Biotechnologia", "CRISPR", "Medycyna"],
            "images": [
                "https://images.unsplash.com/photo-1676206584909-c373cf61cefc?auto=format&w=1080",
            ],
        },
        {
            "author_id": user_entities[2].id,
            "content": "Model AI do przewidywania zmian klimatu osiągnął dokładność 94%.",
            "timestamp": datetime.fromisoformat("2024-11-16T09:15:00"),
            "likes": 189,
            "shares": 34,
            "tags": ["AI", "Klimat", "Machine Learning"],
            "images": [],
        },
    ]

    post_entities = [PostModel(**post) for post in posts_seed]
    db.add_all(post_entities)
    db.commit()


@app.on_event("startup")
def bootstrap() -> None:
    with SessionLocal() as db:
        seed_database(db)
        load_dev_users()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db_session)) -> List[UserResponse]:
    return db.query(UserModel).order_by(UserModel.id).all()


@app.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserPayload, db: Session = Depends(get_db_session)) -> UserResponse:
    user = UserModel(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.patch("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdatePayload, db: Session = Depends(get_db_session)) -> UserResponse:
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Użytkownik nie istnieje")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@app.get("/posts", response_model=List[PostResponse])
def list_posts(db: Session = Depends(get_db_session)) -> List[PostResponse]:
    posts = (
        db.query(PostModel)
        .options(
            joinedload(PostModel.author),
            joinedload(PostModel.comments).joinedload(CommentModel.author),
        )
        .order_by(PostModel.timestamp.desc())
        .all()
    )
    return [serialize_post(post) for post in posts]


@app.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostPayload, db: Session = Depends(get_db_session)) -> PostResponse:
    author = db.query(UserModel).filter(UserModel.id == payload.author_id).first()
    if not author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Autor nie istnieje")

    post = PostModel(**payload.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)

    return serialize_post(load_post_with_relations(db, post.id))


@app.put("/posts/{post_id}", response_model=PostResponse)
def update_post(post_id: int, payload: PostUpdatePayload, db: Session = Depends(get_db_session)) -> PostResponse:
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post nie istnieje")

    for key, value in payload.model_dump().items():
        setattr(post, key, value)

    db.commit()
    return serialize_post(load_post_with_relations(db, post.id))


@app.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(get_db_session)) -> None:
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post nie istnieje")

    db.delete(post)
    db.commit()


@app.post("/posts/{post_id}/like", response_model=PostResponse)
def toggle_like(post_id: int, payload: LikePayload, db: Session = Depends(get_db_session)) -> PostResponse:
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post nie istnieje")

    if payload.direction == "like":
        post.likes += 1
    else:
        post.likes = max(0, post.likes - 1)

    db.commit()
    return serialize_post(load_post_with_relations(db, post.id))


@app.post("/posts/{post_id}/share", response_model=PostResponse)
def register_share(post_id: int, payload: SharePayload, db: Session = Depends(get_db_session)) -> PostResponse:
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post nie istnieje")

    if payload.increment:
        post.shares += 1
    else:
        post.shares = max(0, post.shares - 1)

    db.commit()
    return serialize_post(load_post_with_relations(db, post.id))


@app.post("/posts/{post_id}/comments", response_model=PostResponse)
def add_comment(post_id: int, payload: CommentPayload, db: Session = Depends(get_db_session)) -> PostResponse:
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post nie istnieje")

    author = db.query(UserModel).filter(UserModel.id == payload.author_id).first()
    if not author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Autor komentarza nie istnieje")

    comment = CommentModel(post_id=post_id, **payload.model_dump())
    db.add(comment)
    db.commit()

    return serialize_post(load_post_with_relations(db, post_id))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)