class User {
  constructor(id, name, email, age) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
  }

  getInfo() {
    return `${this.name} (${this.email}) - Age: ${this.age}`;
  }

  isAdult() {
    return this.age >= 18;
  }
}

class UserManager {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  getAllUsers() {
    return this.users;
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }
}

module.exports = { User, UserManager };
