import sington from './sington'
class MyClass {
  constructor(value) {
    this.value = value;
  }
}
const MyClassSington = sington(MyClass)
export default new MyClassSington()
