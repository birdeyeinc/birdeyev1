import CarouselComponent from './index';

export default {
  title: "Atom/Carousel",
  component: CarouselComponent
};

const slideData = [
    <img
      key="1"
      src="https://images.unsplash.com/photo-1712097243043-7458dbcaed71?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />,
    <img
      key="2"
      src="https://images.unsplash.com/photo-1712229102477-f0d8a1b2dbd7?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />,
    <img
      key="3"
      src="https://images.unsplash.com/photo-1555353540-64580b51c258?q=80&w=2778&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />,
    <img
      key="4"
      src="https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/homepage/families-gallery/2023/revuelto/revuelto_m.png"
    />,
    <img
      key="5"
      src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960"
    />,
    <img
      key="6"
      src="https://images.unsplash.com/photo-1570294646112-27ce4f174e38?ixlib=rb-4.0.3"
    />,
    <img
      key="7"
      src="https://www.carandbike.com/_next/image?url=https%3A%2F%2Fc.ndtvimg.com%2F2022-01%2F0d2m0qkg_car_625x300_12_January_22.jpg&w=750&q=75"
    />,
    <img
      key="8"
      src="https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Highlights/pc/verna_model.png"
    />
];

function scrollToElement(elementId) {
  var element = document.getElementById(elementId);
  element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
}

export const Carousel = {
  args: {
    slides: slideData,
    extraSettings: {
      beforeChange: (prev, next) => {
        if ((next > prev && next + 1 !== slideData.length)) scrollToElement(`paging-${next+1}`)
        else scrollToElement(`paging-${next}`)
      },
      customPaging: (i) => {
        return <div id={`paging-${i}`}>{slideData[i]}</div>;
      }
    }
  }
};
