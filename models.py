from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///transactions.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


# 初始化数据库


# 定义交易模型
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=True)
    date = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "amount": self.amount,
            "category": self.category,
            "date": self.date,
        }


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
