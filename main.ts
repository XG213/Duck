input.onButtonPressed(Button.A, function () {
    if (!(ready)) {
        currplayer = false
        ready = true
    } else {
        move(0, -1)
    }
})
function win (plr: number) {
    ready = false
    if (plr == 1 && currplayer || plr == 2 && !(currplayer)) {
        if (single) {
            basic.showString("" + (score.toString()))
        } else {
            control.panic(420)
        }
    } else if (plr == 1 && !(currplayer) || plr == 2 && currplayer) {
        basic.showIcon(IconNames.Happy)
    }
    basic.pause(5000)
    control.reset()
}
input.onButtonPressed(Button.AB, function () {
    if (!(ready)) {
        currplayer = false
        single = true
        p1y = 2
        p2x = -99999
        p2y = -99999
        ready = true
    }
})
input.onButtonPressed(Button.B, function () {
    if (!(ready)) {
        currplayer = true
        ready = true
    } else {
        move(0, 1)
    }
})
radio.onReceivedValue(function (name, value) {
    if (!(ready) || single) {
        return
    }
    if (currplayer) {
        if (name == "x") {
            p1x = value
        } else if (name == "y") {
            p1y = value
        }
    } else {
        if (name == "x") {
            p2x = value
        } else if (name == "y") {
            p2y = value
        }
    }
})
function move (x: number, y: number) {
    if (currplayer) {
        if (p2x + x > 4 || p2x + x < 0 || p2y + y > 4 || p2y + y < 0) {
            return
        }
        p2x += x
        p2y += y
        if (!(single)) {
            radio.sendValue("x", p2x)
            radio.sendValue("y", p2y)
        }
    } else {
        if (p1x + x > 4 || p1x + x < 0 || p1y + y > 4 || p1y + y < 0) {
            return
        }
        p1x += x
        p1y += y
        if (!(single)) {
            radio.sendValue("x", p1x)
            radio.sendValue("y", p1y)
        }
    }
}
function redraw () {
    basic.clearScreen()
    if (mapscroll + 3 > (map.length - 1) * 3) {
        let loop = map.pop() // get looping element
        mapscroll = -2
        if (single) {
            for (let j = map.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [map[j], map[k]] = [map[k], map[j]];
            }
        }
        map.removeAt(map.indexOf(loop))
        map.unshift(loop)
        map.push(loop)
    }
    for (let l = 0; l <= map.length - 1; l++) {
        for (let m = 0; m <= map[l].length - 1; m++) {
            if (map[l][m] == "#") {
                if (l * 3 - mapscroll == p1x && m == p1y) {
                    win(2)
                    return
                }
                if (l * 3 - mapscroll == p2x && m == p2y) {
                    win(1)
                    return
                }
                led.plot(l * 3 - mapscroll, m)
            }
        }
    }
    led.plot(p1x, p1y)
    led.plot(p2x, p2y)
}
let currplayer = false
let single = false
let ready = false
let p1x = 0
let p1y = 0
let p2x = 0
let p2y = 0
let mapscroll = 0
let map: string[][] = []
let leng = 0
let score = 0
let mapcopy: string[][] = []
let mape = false
mapscroll = -5
score = 0
map = [
[
"#",
"#",
".",
".",
"#"
],
[
"#",
"#",
".",
"#",
"#"
],
[
"#",
".",
"#",
"#",
"#"
],
[
"#",
"#",
"#",
".",
"#"
],
[
".",
"#",
"#",
"#",
"#"
],
[
"#",
"#",
"#",
"#",
"."
],
[
"#",
".",
"#",
".",
"#"
],
[
"#",
"#",
".",
"#",
"#"
],
[
".",
"#",
"#",
"#",
"."
]
]
p2y = 1
p2x = 0
p1y = 3
p1x = 0
radio.setFrequencyBand(69)
radio.sendValue("a", 0)
basic.showIcon(IconNames.Duck)
while (!(ready)) {
    basic.pause(25)
}
if (single) {
    for (let o = map.length - 1; o > 0; o--) {
        const p = Math.floor(Math.random() * (o + 1));
        [map[o], map[p]] = [map[p], map[o]];
    }
}
map.push(map[0])
loops.everyInterval(500, function () {
    if (ready) {
        redraw()
        score += 1
        mapscroll += 1
    }
})
