const random = (mod) => {
    return Math.floor(Math.random() * mod);
};

// // console.log(random())

// let result = []
// for (i=0; i<99; i++) {
//     result.push(random(3))
// }
// console.log(result)
// let count = [0,0,0]
// for (i=0; i<=result.length; i++) {
//     if (result[i] == 0) {
//         count[0]++
//     }
//     if (result[i] == 1) {
//         count[1]++
//     }
//     if (result[i] == 2) {
//         count[2]++
//     }
// }
// console.log(count)

// let tab = []
// let count = 0
// for (i=0; i<5; i++) {
//     let rand = random(3)
//     tab[i] = 3 + rand
//     count = count + rand
// }
// console.log(tab)
// console.log(count)


let tab = []
let count = 0
let countFinal = [0,0]
for (i=0; i<1000; i++) {
    for (j=0; j<5; j++) {
        let rand = random(3)
        count = count + rand
    }
    tab[i] = count
    count = 0
}

for (i=0; i<=tab.length; i++) {
    if (tab[i] == 0) {
        countFinal[0]++
    }
    if (tab[i] == 10) {
        countFinal[1]++
    }
}
console.log(countFinal)