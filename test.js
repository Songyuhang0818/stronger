// Function.prototype.a = () => {
//   console.log(1);
// };
// Object.prototype.b = () => {
//   console.log(2);
// };
// function A() {}
// const a = new A();
// a.a();
// a.b();

function Person() {}
Person.prototype.name = "songyuhang";

const person1 = new Person();
const person2 = new Person();
console.log(person1 === Person.prototype);
console.log(person2.name);
