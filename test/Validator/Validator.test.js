const Validator = require('../../src/Validator/Validator');

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
  },
};

function Country(data) {
  this._data = data;
  this.schema = schema;
  this.toJSON = function toJSON() {
    return this._data;
  };
  this.setValidationError = function setValidationError(error) {
    this.error = error;
  };
}

function User(data) {
  this._data = data;
  this.toJSON = function toJSON() {
    return this._data;
  };
}

function Car(data) {
  this._data = data;
  this.toJSON = function toJSON() {
    return this._data;
  };
  this.getValidationSchema = function getValidationSchema() {
    return schema;
  };
}

describe('Validator', () => {
  describe('#isValid()', () => {
    it('returns true for a untype object', () => {
      const validator = new Validator();
      const obj = {
        name: 'Hello',
      };
      const result = validator.isValid(obj);

      expect(result).to.be.eql(true);
    });

    it('returns true for a valid typed object', () => {
      const validator = new Validator();
      const country = new Country({
        name: 'France',
      });
      const result = validator.isValid(country);

      expect(result).to.be.eql(true);
    });

    it('returns false for an invalid typed object', () => {
      const validator = new Validator();
      const country = new Country({
        name: 'France',
        bonjour: 'le monde',
      });
      const result = validator.isValid(country);

      expect(result).to.be.eql(false);
      expect(country.error).to.exist;
    });
  });

  describe('#addSchema()', () => {
    it('returns the schema from the instance class definition', () => {
      const validator = new Validator();
      const country = new Country({
        name: 'France',
      });
      const result = validator.addSchema(country);

      expect(result)
        .to.be.eql(schema);

      expect(validator.tv4.getSchema('Country.json'))
        .to.be.eql(schema);
    });

    it('returns the schema when a string path is provided', () => {
      const validator = new Validator();
      const john = new User({
        name: 'John',
      });
      const result = validator.addSchema(john, `${__dirname}/fixtures/User.json`);
      const userSchema =
        require(`${__dirname}/fixtures/User.json`); // eslint-disable-line global-require

      expect(result)
        .to.be.eql(userSchema);

      expect(validator.tv4.getSchema('User.json'))
        .to.be.eql(userSchema);
    });

    it('returns the schema when a string path is provided', () => {
      const validator = new Validator();
      const ds = new Car({
        name: 'Citroën DS',
      });
      const result = validator.addSchema(ds);

      expect(result)
        .to.be.eql(schema);

      expect(validator.tv4.getSchema('Car.json'))
        .to.be.eql(schema);
    });
  });

  describe('#getClassName()', () => {
    it('returns the class name of a standard object', () => {
      const validator = new Validator();
      const result = validator.getClassName({});

      expect(result).to.be.eql('Object');
    });

    it('returns the class name of an instance', () => {
      const validator = new Validator();
      const result = validator.getClassName(new Country());

      expect(result).to.be.eql('Country');
    });

    it('returns the class name from the constructor', () => {
      const validator = new Validator();
      const result = validator.getClassName(Country);

      expect(result).to.be.eql('Country');
    });

    it('returns the class name from a string', () => {
      const validator = new Validator();
      const result = validator.getClassName('MyClass');

      expect(result).to.be.eql('MyClass');
    });
  });
});
