# app.py

from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

from models import Transaction, db  # 从 models.py 导入数据库和模型

app = Flask(__name__)
CORS(app)

# 配置SQLite数据库
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///transactions.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 初始化数据库
db.init_app(app)

# 创建数据库和表
# with app.app_context():
#     db.create_all()


# 获取所有交易记录
@app.route("/transactions", methods=["GET"])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([transaction.to_dict() for transaction in transactions])


# 添加交易记录
@app.route("/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json()
    if not data or "type" not in data or "amount" not in data:
        return jsonify({"error": "Invalid input"}), 400

    new_transaction = Transaction(
        type=data["type"],
        amount=data["amount"],
        category=data.get("category", "N/A"),
        date=data.get("date", datetime.now().strftime("%Y-%m-%d")),
    )

    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({"message": "Transaction added successfully!"}), 201


if __name__ == "__main__":
    app.run(host="192.168.2.102", debug=True)
