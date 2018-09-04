const viscosity = 0.05

export default class Spring {
    constructor() {
        this.position = 0
        this.targetPosition = 0
    }

    moveBy(delta) {
        this.targetPosition += delta
    }

    update() {
        this.position += (this.targetPosition - this.position) * viscosity
    }
}
