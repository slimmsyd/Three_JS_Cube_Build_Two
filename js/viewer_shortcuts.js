import { cubeBank } from './Database.js';


let arr = Object.keys(cubeBank).map((key) => [key, cubeBank[key]]);

for(let i=0;i<arr.length;i++){
    let id = arr[i][0];

    var d = document.createElement('div');
    d.innerHTML = "ID: ";

    var a = document.createElement('a');
    a.setAttribute('href','../#' + id);
    a.innerHTML = id;

    d.appendChild(a);
    document.getElementById('body').appendChild(d);

    // console.log(id);
}