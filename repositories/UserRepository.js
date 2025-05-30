class UserRepository {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async findByEmail(email) {
    return await this.User.findOne({ email });
  }

  async findById(id) {
    return await this.User.findById(id);
  }

  async create(userData) {
    const user = new this.User(userData);
    return await user.save();
  }
}

module.exports = UserRepository;