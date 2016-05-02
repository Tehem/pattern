const MapperInterface = require('../../src/Mapper/MapperInterface');
const MapperAbstract = require('../../src/Mapper/MapperAbstract');

describe('MapperInterface', () => {
  it('forbids to instanciate the Interface', () => {
    expect(() => {
      const mapper = new MapperInterface();
      expect(mapper).to.be.eql(null);
    }).to.throw();
  });
  it('implements saveObject', () => {
    const mapper = new MapperAbstract();
    expect(() => {
      mapper.saveObject();
    }).to.throw('Must override method');
  });
  it('implements getObject', () => {
    const mapper = new MapperAbstract();
    expect(() => {
      mapper.getObject();
    }).to.throw('Must override method');
  });
  it('implements deleteObject', () => {
    const mapper = new MapperAbstract();
    expect(() => {
      mapper.deleteObject();
    }).to.throw('Must override method');
  });
  it('implements findObject', () => {
    const mapper = new MapperAbstract();
    expect(() => {
      mapper.findObjects();
    }).to.throw('Must override method');
  });
});
