import './index.css'
console.log('this is page2');
async function a () {
    let b = await pro();
    console.log(b)
}
a()
function pro() {
    return new Promise(function (resolve) {
        setTimeout(() => {
            resolve(100)
        }, 1000)
    })
}