const foo = require('./helpers.common')

let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
