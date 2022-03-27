
import React from 'react'
import { TableDataContext } from '../../contexts/tabledata.context'
export class Canvas extends React.Component {
    static contextType?: React.Context<any> = TableDataContext

    tables: any;
    references: any;
    width: any;
    height:any ;
    constructor(props){
        super(props)
        this.tables = this.context.state.tables
        this.references = this.context.state.refs
        this.width = this.context.state.width
        this.height = this.context.height
    }
    render(){
        console.log(this.context.state)
        return <></>
    }
}