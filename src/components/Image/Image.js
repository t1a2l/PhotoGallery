import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./Image.scss";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.count = 0;
    this.calcImageSize = this.calcImageSize.bind(this);

    this.state = {
      size: 200,
      filterIndex: 0, // Index of the filter array
      filter_arr: [
        // Filter array with the diffrent filters
        "none",
        "blur(5px)",
        "grayscale(100%)",
        "sepia(1)",
        "saturate(8)",
        "invert(100%)"
      ],
      src: "", // Image src
      display: "none", // Modal show style
      filter: this.props.dto.filter // Img filter name
    };
  }

  componentDidUpdate(prevProps) {
    // Apply the filter on the copied image
    if (this.props.dto.filter !== prevProps.dto.filter) {
      let index = this.state.filter_arr.indexOf(this.props.dto.filter);
      this.setState({
        filter: this.props.dto.filter,
        filterIndex: index
      });
    }
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size: size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${
      dto.secret
    }.jpg`;
  }

  cloneImage = () => {
    // Clone the image by sending it with its filter to the gallery component
    let myImg = this.props.dto;
    let filter = this.state.filter;
    this.props.showImage(myImg, filter);
  };

  filterImage = () => {
    // Filter the image by going through the filter array each time
    let tempIndex = this.state.filterIndex;
    if (this.state.filterIndex < this.state.filter_arr.length - 1) {
      tempIndex++;
    } else {
      tempIndex = 0;
    }
    this.setState({
      filterIndex: tempIndex,
      filter: this.state.filter_arr[tempIndex]
    });
  };

  expandImage = () => {
    // Expand the image by getting the image src and shhowing the modal
    this.setState({
      src: this.urlFromDto(this.props.dto),
      display: "block"
    });
  };

  modalClose = () => {
    // Close the modal
    this.setState({
      display: "none"
    });
  };

  render() {
    return (
      <div
        className="myImage"
        style={{
          display: "inline-block"
        }}
      >
        <div
          className="image-root"
          style={{
            backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
            width: this.state.size + "px",
            height: this.state.size + "px",
            filter: this.state.filter
          }}
        >
          <div>
            <FontAwesome
              onClick={this.cloneImage.bind(this)}
              className="image-icon"
              name="clone"
              title="clone"
            />
            <FontAwesome
              onClick={this.filterImage.bind(this)}
              className="image-icon"
              name="filter"
              title="filter"
            />
            <FontAwesome
              onClick={this.expandImage.bind(this)}
              className="image-icon"
              name="expand"
              title="expand"
            />
          </div>
        </div>
        <div
          className="modal"
          style={{
            display: this.state.display,
            position: "fixed",
            zIndex: "1",
            paddingTop: "100px",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            overflow: "auto"
          }}
        >
          <span
            className="close"
            style={{
              position: "absolute",
              top: "15px",
              right: "35px",
              color: "#f1f1f1",
              fontSize: "40px",
              fontWeight: "bold",
              transition: "0.3s"
            }}
            onClick={this.modalClose.bind(this)}
          >
            &times;
          </span>
          <img
            className="modal-content"
            src={this.state.src}
            style={{
              margin: "auto",
              display: "block",
              width: "80%",
              maxWidth: "700px",
              backgroundRepeat: "no",
              filter: this.state.filter_arr[this.state.filterIndex]
            }}
          />
        </div>
      </div>
    );
  }
}

export default Image;
