import React, { useEffect, useState} from "react";

function Button(arg){
    return(
        <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
              onClick={arg.handleClick}
              className="form-Chip-label"
            >
              {arg.text}
            </span>
            </div>
    )
}
export default Button;