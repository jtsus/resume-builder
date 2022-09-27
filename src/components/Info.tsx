import React from "react";
import {InfoEntry} from "../types";


const Info = ({entry}: { entry: InfoEntry }) => <div className="info">{entry.content}</div>

export default Info;