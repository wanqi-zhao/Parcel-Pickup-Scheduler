const chai = require('chai');
const sinon = require('sinon');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerUser } = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should register a new user successfully', async () => {
    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      }
    };

    const mockUser = {
      id: '12345',
      name: 'Test User',
      email: 'test@example.com'
    };

    const findOneStub = sinon.stub(User, 'findOne').resolves(null);
    const createStub = sinon.stub(User, 'create').resolves(mockUser);
    const signStub = sinon.stub(jwt, 'sign').returns('mock-token');

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await registerUser(req, res);

    expect(findOneStub.calledOnceWith({ email: req.body.email })).to.be.true;
    expect(createStub.calledOnceWith({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })).to.be.true;
    expect(signStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      token: 'mock-token'
    })).to.be.true;
  });

  it('should return 500 if an error occurs during registration', async () => {
    sinon.stub(User, 'findOne').rejects(new Error('DB Error'));

    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await registerUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});