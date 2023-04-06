package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Onboarding data
type Goal struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	UserId       primitive.ObjectID `bson:"user_id"` //FK
	CoderType    string             `bson:"coder_type,omitempty "`
	Birthday     string             `bson:"bday,omitempty "`
	MBTI         string             `bson:"mbti,omitempty "`
	Workdays     string             `bson:"wdays,omitempty "`
	Workstart    string             `bson:"wstart,omitempty "`
	Workend      string             `bson:"wend,omitempty "`
	Productivity int                `bson:"productivity,omitempty "`
	Stress       int                `bson:"stress,omitempty "`
	Repos        string             `bson:"repos,omitempty "`
	CreatedAt    time.Time          `bson:"createdAt,omitempty"`
	UpdatedAt    time.Time          `bson:"updatedAt,omitempty "`
}
