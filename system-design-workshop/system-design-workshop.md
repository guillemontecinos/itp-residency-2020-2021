# Designing concept–based systems. A practical workshop
*by Guillermo Montecinos*

## Introduction
This workshop addresses the most impoartant skills used to design a system that brings to reality an artistic concept. During the workshop we will analyze the piece [**The Revolt of Replicas**](https://guillemontecinos.cl/portfolio/the-revolt-of-replicas/) created by the workshop author as his thesis project.

## Starting from a concept

## Drafting and testing the concept 

## Designing the system

### Understanding the world as boxes and lines: Block diagrams
Every system, whatever actions it performs, can be understood as a box whose behavior inside is unknown, that takes an `Input` and uses it to generate an `Output`. This is the simplest system we can have.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-workshop/assets/basic-system.jpg" align="middle" width="40%">
</p>

Let's take, for example, [Shannon's model of communication (1948)](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=6773024&tag=1) which simplifies the process of communication between and emissor and a receiver to a series of boxes and lines that describe a flow of information. The `Information Source` –let's say you– emmits a message which is sent over the communication channelby the `Transmitter` –let's say your phone. The `Transmitter` receives the `Message` as an `input` and processes it converting it into a `Signal`. Then, the `Signal` gets into the communication chanel (the box in the center) which also receives the noise comming from the `Noise Source`. Subsequently, the `Receiver` takes the `Received Signal` which is the `Signal` after being affected by `noise` in the communication channel, and converts it into a `Message` that is received by the receiver at the `Destination`.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-workshop/assets/shannon-communication.jpg" align="middle" width="80%">
</p>

As you see, with a simple diagram composed by boxes and arrows we can ilustrate a logical flow of information where an `Input` is affected by a `System` and then converted into an `Output`. We can go further by simplifying Shannon's model by detecting which are the `input`, `output` and `system`. As you can guess, the input is the message comming from the `Information Source`, while the output is the message getting to the `Destination`. Then, the `System` –in our analysis– is composed of the `Transmitter`, the `Noise Source`, the channel and the `Receiver`.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-workshop/assets/shannon-communication-simplified.jpg" align="middle" width="80%">
</p>

Diagrams can go crazier as more complex is each system (like the one below that models a vintage Philips G11 color TV), and also can take different topographies, but let's stick with theis basic idea of boxes connected by arrows.

<p align="center">
  <img src="https://nabilaheruputri.files.wordpress.com/2014/04/g11-block-diagram.jpg" align="middle" width="80%">
</p>

### Identifying inputs and outputs
The inputs and outpus of your system will depend on what your installation is going to look like. If you want to design an interactive piece where sound and visual components get triggered when a person comes into certain area, it's likely that your input will come from a movement detection algorithm –probably feed by a Kinect or a PoseNet model– and the output will be a projector and a couple speakers. 

<!-- Example of an interactive installation -->

On the other hand, the project [CSPAN-5](https://lav.io/projects/cspan-5/) by Sam Lavigne runs a program that everyday downloads a random video from C-SPAN and creates a new video that contains the words that were spoken most frquently, to then post it on Twitter. In this case, the system input is a video incoming from –probably– a scraper algorithm, and the output is call to Twitter's API that posts the video.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-workshop/assets/cspan-5.png" align="middle" width="30%">
</p>

### Identifying processing units

### Sketching the system's workflow (understanding the system as a set of boxes and wires)

## Choosing tools

### Choosing tools for the processing unit

### Choosing communication protocols that connect those units

## Starting to build (how to approach it)

## Conclusion

## Reference
* [Inside your computer – Ted Talk](https://www.youtube.com/watch?v=AkFi90lZmXA)
* [On Teaching the Simplification of Block Diagrams](https://www.ijee.ie/articles/Vol18-6/IJEE1332.pdf)
* [A Mathematical Theory of Communication](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=6773024)
* [G11 Electronics – Early Philips Colour TV](https://philipstv.co.uk/g11-electronics/)

## Case study
### Pulse Room – Rafael Lozano–Hemmer
[Pulse Room](https://lozano-hemmer.com/pulse_room.php) is an interactive installation by the Mexican artis Rafael Lozano-Hemmer that enables users see their heart beat represented on a large room illumination system, conformed by hundreds of incandescent bulbs hanging from a cable 3 meters above the audience. *When someone holds the interface, a computer detects his or her pulse and immediately sets off the closest bulb to flash at the exact rhythm of his or her heart.*

<p align="center">
  <img src="https://lozano-hemmer.com/image_sets/pulse_room/mexico_2020/pulse_room_mexico_city_2020_my_505A4364.jpg" align="middle" width="80%">
</p>

#### Inputs and Outputs
According to the piece's description, the system's input is the human heart beat measured by a Sensor, which converts the heart pulse into an electrical pulse.It can be subject of debate whether the system input is the the actual heart beat or its representation into electrical signals, which obviously affects the way we understand the sensor as part of the system or not. In our analysis we will define that even the system input is the human heart beat, the input device –in other words, the system's entry point– is the sensor, then the input signal is the actual heart beat. Because of this, we can understand the sensor as a part of the system.

On the other hand, the system's output is the effect of hundreds of light bulbs dancing at the user¡s heart pulse. Thus, the output devices are the light bulbs and the output signals that control their behavior are the electric signals emmited by the dimmer packs.

#### Processing Units
The primary process in this system, can be identified as the transduction of the heart pulse into an electric pulse, which is performed by the input sensor. Then a secondary process is the conversion of this pulse into a USB-readable digital signal, performed by an Analog to Digital Converter (ADC), mentioned in the installation's [technical documentation](https://lozano-hemmer.com/texts/manuals/pulse_room.pdf) as a *Go!Link* adapter.

Then, let's analyze the piece's behavior to guess what processes have to be applied to the digital signal in order to generate the output signal. We can assume that the heart beat rate is used to generate a pulse-like electrical signal that dims the bulbs array simulating the spatialization of the heart beat. This terciary step that conforms the system's main process runs on a cumputer and has to output not a single signal, but an array of signals that control each bulb.

Finally, a quaternary process consists in delivering the control signal to each bulb, which is performer by a set of signal routers that feed an array of wires, that finally input all the bulbs on the installation. Since this stage requires stable lightning management, it seems reasonable that the artist decided to use DMX dimmer boxes, which are actuators that demultiplexs a series of control signals transmitted by one cable into a series into a power signals fed to each bulb.

#### Communication protocol
It seems clear that the only stage where it's needed to use a particular communication protocol is between the laptop and the DMX dimmer packages, because the implementation of them forces the protocol. DMX is a standard for digital communication networks commonly used for stage lightning (for further information visit [DMX on Wikipedia](https://en.wikipedia.org/wiki/DMX512) or watch this informative [DMX Lighting Tutorial](https://www.youtube.com/watch?v=z3jM_rbILhs)).

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-workshop/assets/lozano-hemmer-pulse-room.jpg" align="middle" width="80%">
</p>

### The revolt of replicas – Guillermo Montecinos
<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-workshop/assets/system-diagram.jpg" align="middle" width="80%">
</p>

## Reference
