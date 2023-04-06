package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	GID        string             `bson:"github_id"`
	Name       string             `bson:"name"`
	UserName   string             `bson:"username"`
	Email      string             `bson:"email"`
	AvatarURL  string             `bson:"avatar_url"`
	ProfileURL string             `bson:"profile_url"`
	Token      string             `bson:"access_token"`
	Bio        string             `bson:"bio"`
	LastLogin  time.Time          `bson:"last_login"`
	CreatedAt  time.Time          `bson:"createdAt,omitempty"`
	UpdatedAt  time.Time          `bson:"updatedAt"`
}
