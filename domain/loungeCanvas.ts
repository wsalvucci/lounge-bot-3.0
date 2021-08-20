import Canvas, { NodeCanvasRenderingContext2D } from 'canvas'
import Color from 'color'

Canvas.registerFont('./build/assets/fonts/Quicksand-Regular.ttf', {
    family: 'Quicksand'
})

Canvas.registerFont('./build/assets/fonts/Quicksand-Bold.ttf', {
    family: 'Boldsand'
})

export function createText(
    ctx: NodeCanvasRenderingContext2D,
    fillStyle: string,
    font: string,
    text: string,
    x: number,
    y: number,
    alignment: CanvasTextAlign = 'left') {
    ctx.fillStyle = fillStyle
    ctx.font = font
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}

export function createDivider(
    ctx: NodeCanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    w: number,
    dividerHeight: number = 1,
    header: string = ""
) {
    var grd = ctx.createLinearGradient(x, y, x + w, y + dividerHeight)
    grd.addColorStop(0, `${Color(color).alpha(0)}`)
    grd.addColorStop(0.25, `${Color(color).alpha(1)}`)
    grd.addColorStop(0.75, `${Color(color).alpha(1)}`)
    grd.addColorStop(1, `${Color(color).alpha(0)}`)
    ctx.fillStyle = grd
    ctx.fillRect(x, y, w, dividerHeight)
    createText(ctx, '#ffffff', `18px Quicksand`, header, x, y-2)
}

export default Canvas
