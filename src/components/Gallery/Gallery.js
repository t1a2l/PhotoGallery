import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      img_filter: "none", // Apply filter property for every image
      time: "", // Set and clear the character typing delay
      page: 1 // Page number of the images from the server
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${
      this.state.page
    }&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = "https://api.flickr.com/";
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: "GET"
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({
            images: this.state.images.concat(res.photos.photo)
          });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    document.addEventListener("scroll", this.trackUserScrolling.bind(this));
  }

  trackUserScrolling = () => {
    // Show more items as the user goes down
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 210
    ) {
      this.setState(
        {
          page: this.state.page + 1
        },
        this.getImages.bind(this, this.props.tag)
      );
    }
  };

  componentWillReceiveProps(props) {
    // Timeout for typing
    clearTimeout(this.state.time);
    this.setState({
      time: setTimeout(this.getImages.bind(this), 500, props.tag)
    });
  }

  jsonCopy(obj) {
    // Clone the image object using json
    return JSON.parse(JSON.stringify(obj));
  }

  showImage(img, filter) {
    // The copied image object from the image component
    // to copy and add to the image array of the gallery
    img_clone = {};
    let index = this.state.images.indexOf(img);
    let img_clone = this.jsonCopy(img);
    img_clone.filter = filter;
    if (index < this.state.images.length)
      this.state.images.splice(index + 1, 0, img_clone);
    else this.state.images.push(img_clone);
    this.setState({
      images: this.state.images
    });
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto, index) => {
          // Apply filter property for every image component
          if (dto.filter == undefined) {
            dto.filter = this.state.img_filter;
          }
          return (
            <Image
              key={"image-" + index}
              dto={dto}
              galleryWidth={this.state.galleryWidth}
              showImage={this.showImage.bind(this)}
              filter={dto.filter}
            />
          );
        })}
      </div>
    );
  }
}

export default Gallery;
