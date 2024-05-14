const React = require('react');
const ReactDOM = require('react-dom');

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const newMage = {};
		this.props.attributes.forEach(attribute => {
			newMage[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newMage);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		const inputTextArea = this.props.attributes
		.filter(attribute => attribute=="description")
		.map(attribute =>
			<p key={attribute}>
				<label for={attribute} class="form-label">{attribute}</label>
				<textarea ref={attribute} className="form-control" rows="5"/>
			</p>
		);
		const inputsSimple = this.props.attributes
		.filter(attribute => attribute!="description")
		.map(attribute =>
			<p key={attribute}>
				<label for={attribute} class="form-label">{attribute}</label>
				<input type="text" ref={attribute} className="field form-control"/>
			</p>			
		);

		return (
			<div>
				<a href="#createMage">Create an article</a>

				<div id="createMage" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new article</h2>

						<form>
							{inputsSimple}
							{inputTextArea}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}



export {CreateDialog}; // Don’t forget to use export default!

