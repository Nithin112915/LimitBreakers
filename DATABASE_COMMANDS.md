# MongoDB Database Commands for LimitBreakers

## Connect to MongoDB Shell
```bash
mongosh mongodb://localhost:27017/limitbreakers
```

## Basic Database Commands

### Show all collections
```javascript
show collections
```

### View all users
```javascript
db.users.find().pretty()
```

### Count users
```javascript
db.users.countDocuments()
```

### View all tasks/habits
```javascript
db.tasks.find().pretty()
```

### Count tasks
```javascript
db.tasks.countDocuments()
```

### View recent users (last 5)
```javascript
db.users.find().sort({createdAt: -1}).limit(5).pretty()
```

### View users with most honor points
```javascript
db.users.find().sort({honorPoints: -1}).limit(5).pretty()
```

### View tasks by category
```javascript
db.tasks.find({category: "health"}).pretty()
```

### View completed tasks (with completions)
```javascript
db.tasks.find({"completions.0": {$exists: true}}).pretty()
```

### Database Statistics
```javascript
db.stats()
```

### Collection Statistics
```javascript
db.users.stats()
db.tasks.stats()
```

## Advanced Queries

### Find user by email
```javascript
db.users.findOne({email: "thisisnithin99@gmail.com"})
```

### Find tasks for specific user
```javascript
// First get user ID
var user = db.users.findOne({email: "thisisnithin99@gmail.com"})
// Then find tasks
db.tasks.find({userId: user._id}).pretty()
```

### Update user honor points
```javascript
db.users.updateOne(
  {email: "thisisnithin99@gmail.com"}, 
  {$inc: {honorPoints: 100}}
)
```

### Create test habit
```javascript
db.tasks.insertOne({
  userId: ObjectId("your-user-id"),
  title: "Morning Exercise",
  description: "30 minutes of exercise",
  category: "health",
  difficulty: "medium",
  honorPointsReward: 20,
  createdAt: new Date()
})
```
