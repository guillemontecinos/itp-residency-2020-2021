import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

class Boid{
    constructor(_geometry){
        this.size = _geometry.attributes.position.count
        this.boids = new Array()
        this.maxCohesionForce = 2
        this.maxSeparationForce = .75
        this.maxSpeed = .005
        for(let i = 0; i < this.size; i++){
            this.boids.push(
                {
                    position: new THREE.Vector3(_geometry.attributes.position.array[3 * i], _geometry.attributes.position.array[3 * i + 1], _geometry.attributes.position.array[3 * i + 2]),
                    velocity: new THREE.Vector3(Math.random() * .01, Math.random() * .01, Math.random() * .01),
                    // velocity: new THREE.Vector3(),
                    acceleration: new THREE.Vector3(),
                    separation: new THREE.Vector3(),
                    cohesion: new THREE.Vector3()
                }
            )
        }
    }
    separation(){
        const perceptionRad = .1
        this.boids.forEach((boid) => {
            let separation = new THREE.Vector3()
            let cohesion = new THREE.Vector3()
            let total = 0
            this.boids.forEach((other) => {
                const d = boid.position.distanceTo(other.position)
                if(other != boid && d < perceptionRad) {
                    const diff = new THREE.Vector3().copy(boid.position)
                    diff.sub(other.position)
                    diff.divideScalar(d * d)
                    separation.add(diff)
                    // cohesion.add(other.position)
                    total++
                }
            })
            if(total > 0) {
                separation.divideScalar(total)
                separation.setLength(this.maxSpeed)
                separation.sub(boid.velocity)
                separation.setLength(this.maxSeparationForce)
            }
            boid.separation.copy(separation)
        })
        
    }
    cohesion(){
        const perceptionRad = .2
        this.boids.forEach((boid) => {
            let cohesion = new THREE.Vector3()
            let total = 0
            this.boids.forEach((other) => {
                const d = boid.position.distanceTo(other.position)
                if(other != boid && d < perceptionRad) {
                    cohesion.add(other.position)
                    total++
                }
            })
            if(total > 0) {
                cohesion.divideScalar(total)
                cohesion.sub(boid.position)
                cohesion.setLength(this.maxSpeed)
                cohesion.sub(boid.velocity)
                cohesion.clampLength(0, this.maxCohesionForce)
            }
            cohesion.multiplyScalar(70)
            boid.cohesion.copy(cohesion)
        })
    }
    
    update(_geometry){
        this.separation()
        this.cohesion()
        const positions = _geometry.attributes.position.array
        this.boids.forEach((boid, i) => {
            boid.position.add(boid.velocity)
            boid.velocity.add(boid.acceleration)
            boid.velocity.clampLength(0, this.maxSpeed)
            boid.acceleration.add(boid.separation)
            boid.acceleration.add(boid.cohesion)
            
            positions[3 * i] = boid.position.x
            positions[3 * i + 1] = boid.position.y
            positions[3 * i + 2] = boid.position.z
        })
        _geometry.attributes.position.needsUpdate = true
    }
}

export default Boid