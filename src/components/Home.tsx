import React from 'react'
import AceEditor from 'react-ace'
import AceGrammar from '../grammar/aceGrammar'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/mode-text'
import '../assets/tailwind.generated.css'
import 'ace-builds/webpack-resolver';
import { TableDataContext } from '../contexts/tabledata.context'
import { SchemaDBParser } from '../grammar/db-grammar/src/parser'
import { createSchemaDBVisitor } from '../grammar/db-grammar/src/visitor'
import { DBDefinitionLexer } from '../grammar/db-grammar/src/lexer'
import { debounce } from './common/utils'
import { uniqBy } from 'lodash'
import { IDbElement, IRefElement, ITableElement } from '../grammar/db-grammar/src/types/index.d'
interface HomeStateInterface{
  schema: string
}
export class Home extends React.Component<object, HomeStateInterface> {

    aceComponent: React.RefObject<AceEditor>
    editorValue: React.MutableRefObject<string|undefined|null>

    schemeParser:any  = new SchemaDBParser()
    customVisitor:any = createSchemaDBVisitor(this.schemeParser)

    debouncedHook = debounce((text:string)=>{
      try {
        const schema = text.trim() + '\n'
        const parsedScheme = this.parseInput(schema)
        this.getTableLayout(parsedScheme).then((response) => {
        //   //dispatch({type: 'set', data: response})
        })
        console.log(parsedScheme)
      } catch (ex) {
        console.log(ex)
      }
    }, 500)

    async getTableLayout(data: IDbElement[]){
      if (data){
        console.log(data)
        const tables:ITableElement[] = data.filter((item) => {
          return item.type === 'table'
        })
        const uniqueTables:ITableElement[] = uniqBy(tables, 'name')
      
        const availableColumns = uniqueTables
          .map((table) => {
            return table.columns.map((column) => {
              return `${table.name}.${column.name}`
            })
          })
          .flat()

          console.log(availableColumns)
      
        const refs: IRefElement[] = data.filter((item:IRefElement) => {
          return item.type === 'ref'
        })
      
        const filteredRefs = refs.filter(({foreign, primary}) => {
          const foreignRef = `${foreign.table}.${foreign.column}`
          const primaryRef = `${primary.table}.${primary.column}`
      
          return (
            availableColumns.includes(foreignRef) &&
            availableColumns.includes(primaryRef)
          )
        })
      
        // return arrangeItems(uniqueTables, filteredRefs)
      }
    }

    parseInput(text: string){
      const lexingResult = DBDefinitionLexer.tokenize(text)
      this.schemeParser.input = lexingResult.tokens

      const result = this.schemeParser.elements()
      const parsetOutput = this.customVisitor.visit(result)

      if (this.schemeParser.errors.length > 0) {
        console.error(this.schemeParser.errors)
        // throw new Error('sad sad panda, Parsing errors detected')
      }

      return parsetOutput
    }
    constructor(props: object){
        super(props)
        const schema = localStorage.getItem('schema')
        if (schema){
          this.state = {schema}
        }else{
          this.state = {schema}
        }
        this.aceComponent = React.createRef<AceEditor>()

        this.schemeParser = new SchemaDBParser()
        this.customVisitor = createSchemaDBVisitor(this.schemeParser)
        this.dispatch = this.dispatch.bind(this)
        this.parseInput = this.parseInput.bind(this)
        this.debouncedHook = this.debouncedHook.bind(this)
       
    }
    componentDidMount(): void {
      const customGrammar = new AceGrammar()
        if (this.aceComponent && this.aceComponent.current && this.aceComponent.current.editor) {
            // @ts-ignore   
            this.aceComponent.current.editor.session.setMode(customGrammar)
            // this.aceComponent.current.editor.getSession().setMode('css')
            // this.aceComponent.current.editor.getSession().setMode(customGrammar)
        }
    }

    componentWillUnmount(){
    }

    dispatch(){

    }

    render(){
        return <div className="flex bg-gray-300 h-screen w-screen">
        <div className="pr-1" style={{height: '100%', width: '250px'}}>
          <AceEditor
            ref={this.aceComponent}
            value={this.state?.schema}
            mode="text"
            theme="dracula"
            width="100%"
            height="100%"
            onChange={(e) => {
                this.setState({schema: e})
                localStorage.setItem('schema',e)
                this.debouncedHook(e)
            }}
            editorProps={{$blockScrolling: true}}
           />
        </div>
        <div className="flex-1 bg-white overflow-scroll shadow-inner">
          { <TableDataContext.Provider value={{state: this.state, dispatch: this.dispatch}}>
            {/* <Canvas /> */}
          </TableDataContext.Provider>}
        </div>
      </div>
    }

}