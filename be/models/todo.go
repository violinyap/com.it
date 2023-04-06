package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Todo struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserId      primitive.ObjectID `bson:"user_id"` //FK
	Type        string             `bson:"type"`
	Task        string             `bson:"task"`
	Completed   bool               `bson:"completed"`
	CreatedAt   time.Time          `bson:"createdAt,omitempty"`
	CompletedAt time.Time          `bson:"completedAt,omitempty "`
	UpdatedAt   time.Time          `bson:"updatedAt"`
}
