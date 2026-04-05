const chai = require('chai');
const sinon = require('sinon');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const jwt = require('jsonwebtoken');
const { registerUser, registerCustomer, loginCustomer } = require('../controllers/authController');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { createAdminSlot, getAdminSlots, deleteAdminSlot } = require('../controllers/adminController');
const { expect } = chai;

// ─── Auth Controller Tests ───────────────────────────────────────────────────

describe('Auth Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  // Legacy registerUser kept for backward compatibility
  it('registerUser: should register a new user successfully', async () => {
    const req = { body: { name: 'Test User', email: 'test@example.com', password: '123456' } };
    const mockUser = { id: '12345', name: 'Test User', email: 'test@example.com' };

    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(User, 'create').resolves(mockUser);
    sinon.stub(jwt, 'sign').returns('mock-token');

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await registerUser(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({ id: mockUser.id, name: mockUser.name, email: mockUser.email, token: 'mock-token' })).to.be.true;
  });

  it('registerUser: should return 500 if a DB error occurs', async () => {
    sinon.stub(User, 'findOne').rejects(new Error('DB Error'));
    const req = { body: { name: 'Test', email: 'test@example.com', password: '123456' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await registerUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

  // registerCustomer
  it('registerCustomer: should register a customer with valid data', async () => {
    const req = {
      body: { firstName: 'Jane', lastName: 'Doe', phone: '0412345678', email: 'jane@example.com', password: 'secret123' }
    };
    const mockCustomer = {
      _id: 'cust1', firstName: 'Jane', lastName: 'Doe',
      phone: '0412345678', email: 'jane@example.com', role: 'customer'
    };

    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(User, 'create').resolves(mockCustomer);
    sinon.stub(jwt, 'sign').returns('customer-token');

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await registerCustomer(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    const jsonArg = res.json.firstCall.args[0];
    expect(jsonArg).to.have.property('token', 'customer-token');
    expect(jsonArg).to.have.property('role', 'customer');
  });

  it('registerCustomer: should return 400 if required fields are missing', async () => {
    const req = { body: { firstName: 'Jane', password: 'secret123' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await registerCustomer(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('registerCustomer: should return 400 if phone is invalid', async () => {
    const req = { body: { firstName: 'Jane', lastName: 'Doe', phone: 'abc', password: 'secret123' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await registerCustomer(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('registerCustomer: should return 400 if customer already exists', async () => {
    sinon.stub(User, 'findOne').resolves({ _id: 'existing', phone: '0412345678' });
    const req = {
      body: { firstName: 'Jane', lastName: 'Doe', phone: '0412345678', password: 'secret123' }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await registerCustomer(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  // loginCustomer
  it('loginCustomer: should return 400 if identifier or password is missing', async () => {
    const req = { body: { identifier: '', password: '' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await loginCustomer(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('loginCustomer: should return 401 if credentials are invalid', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    const req = { body: { identifier: 'notfound@example.com', password: 'wrongpass' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await loginCustomer(req, res);

    expect(res.status.calledWith(401)).to.be.true;
  });
});

// ─── Booking Controller Tests ────────────────────────────────────────────────

describe('Booking Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('createBooking: should return 400 if dateLabel or timeLabel is missing', async () => {
    const req = {
      body: { location: 'Counter A' },
      user: { _id: 'user1' }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createBooking(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('createBooking: should create a booking successfully', async () => {
    const mockBooking = {
      _id: 'book1', bookingId: 'BK-001',
      dateLabel: '18 Mar 2026', timeLabel: '09:00-09:30',
      status: 'Upcoming', userId: 'user1'
    };

    sinon.stub(Booking, 'findOne').resolves(null);
    sinon.stub(Booking, 'create').resolves(mockBooking);

    const req = {
      body: { dateLabel: '18 Mar 2026', timeLabel: '09:00-09:30', location: 'Counter A' },
      user: { _id: 'user1' }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createBooking(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    const jsonArg = res.json.firstCall.args[0];
    expect(jsonArg).to.have.property('bookingId', 'BK-001');
    expect(jsonArg).to.have.property('status', 'Upcoming');
  });

  it('getMyBookings: should return bookings for the authenticated user', async () => {
    const mockBookings = [
      { _id: 'b1', bookingId: 'BK-001', status: 'Upcoming', userId: 'user1' },
      { _id: 'b2', bookingId: 'BK-002', status: 'Upcoming', userId: 'user1' }
    ];

    const sortStub = sinon.stub().resolves(mockBookings);
    sinon.stub(Booking, 'find').returns({ sort: sortStub });

    const req = { user: { _id: 'user1' }, query: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getMyBookings(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockBookings)).to.be.true;
  });

  it('cancelBooking: should return 404 if booking is not found', async () => {
    sinon.stub(Booking, 'findOne').resolves(null);

    const req = { params: { id: 'nonexistent' }, user: { _id: 'user1' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await cancelBooking(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });
});

// ─── Slot Controller Tests ────────────────────────────────────────────────────

describe('Slot Controller (Admin)', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('createAdminSlot: should return 400 if required fields are missing', async () => {
    const req = { body: { dateLabel: '18 Mar 2026' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createAdminSlot(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('createAdminSlot: should create a slot successfully', async () => {
    const mockSlot = {
      _id: 'slot1', dateLabel: '18 Mar 2026', timeLabel: '09:00-09:30',
      capacity: 10, status: 'available'
    };

    sinon.stub(Slot, 'findOne').resolves(null);
    sinon.stub(Slot, 'create').resolves(mockSlot);

    const req = { body: { dateLabel: '18 Mar 2026', timeLabel: '09:00-09:30', capacity: 10, status: 'available' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createAdminSlot(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(mockSlot)).to.be.true;
  });

  it('createAdminSlot: should return 400 if capacity is negative', async () => {
    const req = { body: { dateLabel: '18 Mar 2026', timeLabel: '09:00-09:30', capacity: -1 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createAdminSlot(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('getAdminSlots: should return all slots', async () => {
    const mockSlots = [
      { _id: 's1', dateLabel: '18 Mar 2026', timeLabel: '09:00-09:30', capacity: 10, status: 'available' }
    ];

    const sortStub = sinon.stub().resolves(mockSlots);
    sinon.stub(Slot, 'find').returns({ sort: sortStub });

    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getAdminSlots(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockSlots)).to.be.true;
  });

  it('deleteAdminSlot: should return 404 if slot does not exist', async () => {
    sinon.stub(Slot, 'findById').resolves(null);

    const req = { params: { id: 'nonexistent' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteAdminSlot(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });
});
