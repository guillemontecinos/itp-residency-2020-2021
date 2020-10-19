# Creative Systems as blocks and lines – Case Study of Pulse Room by Rafael Lozano–Hemmer
*by Guillermo Montecinos*

## Introduction
Everytime I try any kind of installation or creative experience, the first thing I do is guessing what's the logic system that delivers the output I have in front of me. I analyze the piece not only conceptually, but in terms of what inputs are being collected, from where, what the system is probably doing with those inputs and how the output is delivered. I like to guess the type of sensors and actuators used, as well as the processing engine behind the scenes.

In this blogpost I'll try to describe my approach to sistematize a creative system as a netowork of blocks –boxes that perform operations to data– and lines –that represent data paths within the system. First of all I will talk about the importance of understanding the world as a representation of blocks, then I'll analyze the piece *Pulse* by the Mexican artist Rafael Lozano–Hemmer.

Every system, whatever actions it performs, can be understood as a box whose behavior inside is unknown, that takes an `Input` and uses it to generate an `Output`. This is the simplest system we can have: 

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/basic-system.jpg" align="middle" width="40%">
</p>

## Shannon's model of communication – An example
Let's take, for example, [Shannon's model of communication (1948)](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=6773024&tag=1) which sistematizes the process of communication between an emissor and a receiver as a series of boxes and arrows that describe a flow of information. The `Information Source` –let's say you– emmits a message which is sent over the communication channel by the `Transmitter` –let's say your phone. The `Transmitter` receives the `Message` converts it into a `Signal`. Then, the `Signal` gets into the communication chanel (the box in the center) which also receives the noise comming from the `Noise Source`. Subsequently, the `Receiver` takes the `Received Signal` which is the `Signal` after being affected by `noise`, and converts it in a `Message` received at the `Destination`.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/shannon-communication.jpg" align="middle" width="80%">
</p>

With a simple diagram composed by boxes and arrows we can ilustrate a logical flow of information where an `Input` is affected by a `System` and then converted to an `Output`. We can go further and simplify Shannon's model by detecting which are the `input`, `output` and `system`. It's clear that the input is the message incoming from the `Information Source`, while the output is the message getting to the `Destination`. Then, the `System` –in our analysis– is composed of the `Transmitter`, the `Noise Source`, the channel and the `Receiver`.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/shannon-communication-simplified.jpg" align="middle" width="80%">
</p>

## Jim Campbell's Formula for Computer Art
*Formula for Computer Art* is an animated piece by the artist Jim Campbell that –quoting [Golan Levin](http://www.flong.com/texts/essays/see_this_sound_old/)– *"mischievously implies that the inputs to many data-mapping artworks may be fundamentally arbitrary and thus interchangeable"*. 
Even though the piece criticizes the *flexibility* and *arbitrariness* in which interactive systems can be designed, it uses the formal language of diagrams, so we can use it as a guide to think about systems.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/jim-campbell-formula.jpg" align="middle" width="80%">
</p>

According to the piece's logic, all possible inputs on the left can be captured by sensors and converted into data signals understandable by the systems. Anytime an input is received, it triggers an input interrupter that let's the algorithms know a new input signal came. Those signals are processed by the algorithms, stored in memory and combined with data already stored to generate an output signal. A new output signal executes an output controller that represents it in the real world.

Based on the above we can say that the system is everything that takes place after the input signals are interpreted by the sensory devices, and before the output signals are represented in the physical world. Then Jim Campbell's artwork can be reinterpreted as a framework that will help us to design and analyze systems.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/jim-campbell-adapted.jpg" align="middle" width="80%">
</p>

<!-- Diagrams can go crazier as more complex is each system (like the one below that models a vintage Philips G11 color TV), and also can take different topographies, but let's stick with theis basic idea of boxes connected by arrows.

<p align="center">
  <img src="https://nabilaheruputri.files.wordpress.com/2014/04/g11-block-diagram.jpg" align="middle" width="80%">
</p> -->

## Identifying inputs and outputs
The inputs and outpus of your system will depend on what your installation is going to look like. If you want to design an interactive piece where sound and visual components get triggered when a person comes into certain area, it's likely that your input will come from a movement detection algorithm –probably feed by a Kinect or a PoseNet model– and the output will be a projector and a couple speakers. 

<!-- Example of an interactive installation -->

On the other hand, the project [CSPAN-5](https://lav.io/projects/cspan-5/) by Sam Lavigne runs a program that everyday downloads a random video from C-SPAN and creates a new video that contains the words that were spoken most frquently, to then post it on Twitter. In this case, the system input is a video incoming from –probably– a scraper algorithm, and the output is call to Twitter's API that posts the video.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/cspan-5.png" align="middle" width="30%">
</p>

## Case study
### Pulse Room – Rafael Lozano–Hemmer
[Pulse Room](https://lozano-hemmer.com/pulse_room.php) is an interactive installation by the Mexican artis Rafael Lozano-Hemmer that enables users see their heart beat represented on a large room illumination system, conformed by hundreds of incandescent bulbs hanging from a cable 3 meters above the audience. *When someone holds the interface, a computer detects his or her pulse and immediately sets off the closest bulb to flash at the exact rhythm of his or her heart.*

<p align="center">
  <img src="https://lozano-hemmer.com/image_sets/pulse_room/mexico_2020/pulse_room_mexico_city_2020_my_505A4364.jpg" align="middle" width="80%">
</p>

#### Inputs and Outputs
According to the piece's description, the system's input is the human heart beat measured by a Sensor, which converts the heart pulse into an electrical pulse.It can be subject of debate whether the system input is the the actual heart beat or its representation into electrical signals, which obviously affects the way we understand the sensor as part of the system or not. In our analysis we will define that even the system input is the human heart beat, the input device –in other words, the system's entry point– is the sensor, then the input signal is the actual heart beat. Because of this, we can understand the sensor as a part of the system.

On the other hand, the system's output is the effect of hundreds of light bulbs dancing at the user's heart pulse. Thus, the output devices are the light bulbs and the output signals that control their behavior are the electric signals emmited by the dimmer packs.

#### Processing Units
The primary process in this system, can be identified as the transduction of the heart pulse into an electric pulse, which is performed by the input sensor. Then a secondary process is the conversion of this pulse into a USB-readable digital signal, performed by an Analog to Digital Converter (ADC), mentioned in the installation's [technical documentation](https://lozano-hemmer.com/texts/manuals/pulse_room.pdf) as a *Go!Link* adapter.

Then, let's analyze the piece's behavior to guess what processes have to be applied to the digital signal in order to generate the output signal. We can assume that the heart beat rate is used to generate a pulse-like electrical signal that dims the bulbs array simulating the spatialization of the heart beat. This terciary step that conforms the system's main process runs on a cumputer and has to output not a single signal, but an array of signals that control each bulb.

Finally, a quaternary process consists of delivering the control signal to each bulb, which is performed by a set of signal routers that feed an array of wires, that finally input all the bulbs on the installation. Since this stage requires stable lightning management, it seems reasonable that the artist decided to use DMX dimmer boxes, which are actuators that demultiplexs a series of control signals transmitted by one cable into a series of power signals that fed each bulb. Please note that due to DMX's architecture, the wiring between the laptop (main process) and the dimmer packs has to be set as a chain of packs.

#### Communication protocol
It seems clear that the only stage where it's needed to use a particular communication protocol is between the laptop and the DMX dimmer packages, because the implementation of them forces the protocol. DMX is a standard for digital communication networks commonly used for stage lightning (for further information visit [DMX on Wikipedia](https://en.wikipedia.org/wiki/DMX512) or watch this informative [DMX Lighting Tutorial](https://www.youtube.com/watch?v=z3jM_rbILhs)).

#### System Diagram
<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/lozano-hemmer-pulse-room.jpg" align="middle" width="80%">
</p>

<!-- ### The revolt of replicas – Guillermo Montecinos
<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/system-design-blog/assets/system-diagram.jpg" align="middle" width="80%">
</p> -->

## Reference
* [Inside your computer – Ted Talk](https://www.youtube.com/watch?v=AkFi90lZmXA)
* [On Teaching the Simplification of Block Diagrams](https://www.ijee.ie/articles/Vol18-6/IJEE1332.pdf)
* [A Mathematical Theory of Communication](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=6773024)
* [G11 Electronics – Early Philips Colour TV](https://philipstv.co.uk/g11-electronics/)
* [Cognitive tools shape thought: diagrams in design](file:///Users/guillermo/Downloads/Nickerson2013_Article_CognitiveToolsShapeThoughtDiag.pdf)
* [Thinking with Diagrams in Architectural Design](file:///Users/guillermo/Downloads/Do-Gross2001_Article_ThinkingWithDiagramsInArchitec.pdf)
* [Lauren Lee McCarthy (US): SOMEONE](https://ars.electronica.art/prix/en/winners/interactive-art/)