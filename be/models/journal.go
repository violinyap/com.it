package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Journal struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UserId    primitive.ObjectID `bson:"user_id"` //FK
	Type      string             `bson:"type"`
	Answers   string             `bson:"answers"`
	Score     string             `bson:"score"`
	Date      string             `bson:"date"`
	CreatedAt time.Time          `bson:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt"`
}
