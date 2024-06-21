const bcrypt = require('bcrypt')

console.log(bcrypt.hashSync('12345678', 10))

console.log(bcrypt.compareSync('12345678', '$2b$10$y8jizHdqr8haY2eQ0ULIjeLTDaZjKXbCwdODj5vDnRjYq03lUA0KG'))
