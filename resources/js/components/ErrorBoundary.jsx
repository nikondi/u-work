import {Component} from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, error: null, stackOpened: false};
    }

    static getDerivedStateFromError() {    // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {    // You can also log the error to an error reporting service
        this.setState({...this.state, error: error});
    }

    render() {
        if(this.state.hasError) {      // You can render any custom fallback UI
            return (<div className="p-4 bg-red-600 text-white rounded-md">
                <h1 className="text-lg font-bold">Произошла ошибка</h1>
                {this.state.error && <>
                    <div className="rounded-md p-3 bg-gray-700 mt-3 mb-4">
                        {this.state.error.stack && <div className="text-xs mb-2"><StackLine parsed_line={getStackFirstLine(this.state.error.stack)} /></div>}
                        <div className="text-lg">{this.state.error.message}</div>
                    </div>
                    {this.state.error.stack && <>
                        <div><button onClick={() => this.setState({...this.state, stackOpened: !this.state.stackOpened}) } className="btn bg-gray-800 hover:bg-gray-700 px-3 py-2">{this.state.stackOpened?'Закрыть':'Открыть'} стек</button></div>
                        {this.state.stackOpened &&
                            <div className="pt-4">{this.state.error.stack.split('\n').map((line, i) => {
                                const parsed_line = parseStackLine(line);
                                if(!parsed_line)
                                    return (<div key={i}>{line}</div>);
                                else {
                                    return (<StackLine key={i} parsed_line={parsed_line} />)
                                }
                            })}</div>
                        }
                    </>}
                </>}
            </div>);
        }
        return this.props.children;
    }
}

function StackLine({parsed_line}) {
    return <div className={
        (parsed_line.file.includes(location.hostname) && !parsed_line.function.includes('__require') && !parsed_line.function.includes('node_modules') && !parsed_line.file.includes('node_modules'))?'':'text-gray-400'}
    >
        {parsed_line.function} <b>{parsed_line.file}</b> {parsed_line.line}:{parsed_line.char}
    </div>
}

function parseStackLine(line) {
    return (/(?<function>.*)@(?<file>.*):(?<line>.*):(?<char>.*)/gm).exec(line)?.groups;
}
function getStackFirstLine(stack) {
    return parseStackLine(stack.split('\n')[0]);
}
