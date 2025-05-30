class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      await this.authService.register({ name, email, password });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      if (error.message === 'All fields are required' || error.message === 'Email already exists') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.json(result);
    } catch (error) {
      if (error.message === 'All fields are required' || error.message === 'Invalid credentials') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AuthController;