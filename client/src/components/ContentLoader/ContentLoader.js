import React from "react";
import Loader from 'react-loader-spinner';

const ContentLoader = ({color, visible}) => {
    return (
        <div className="text-center">
            <Loader
            type="ThreeDots"
            color={color}
            height={70}
            width={70}
            timeout={4000}
            visible={visible}
        />
        </div>
    )
}

export default ContentLoader;