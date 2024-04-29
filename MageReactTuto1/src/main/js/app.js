'use strict';

import MageList from './components/mageList';
import AppEquipement from './components/equipementList';
import {CreateDialog} from './components/dialog';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./connection/client');

const follow = require('./connection/follow'); // function to hop multiple links by "rel"

function followApi(relArray) {
	return follow(client, '/api', relArray);
}

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {mages: [], attributes: [], pageSize: 3, links: {}}; // variables gloabal
		// ecouteurs
		this.updatePageSize = this.updatePageSize.bind(this);
		//this.onCreate = this.onCreate.bind(this);
		this.onCreateREF = this.onCreateREF.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
	}
	
	/*
	loadFromServer(pageSize) {
		followApi([{rel: 'mages', params: {size: pageSize}}]
		).then(mageCollection => {
			return client({
				method: 'GET',
				path: mageCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return mageCollection;
			});
		}).done(mageCollection => {
			this.setState({
				mages: mageCollection.entity._embedded.mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: mageCollection.entity._links});
		});
	}
	*/
	
	loadFromServer(pageSize) {
		followApi([{rel: 'mages', params: {size: pageSize}}]
		).then(mageCollection => {
			return client({
				method: 'GET',
				path: mageCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				this.links = mageCollection.entity._links;
				return mageCollection;
			});
		}).then(mageCollection => {
			return mageCollection.entity._embedded.mages.map(mage =>
					client({
						method: 'GET',
						path: mage._links.self.href
					})
			);
		}).then(magePromises => {
			return when.all(magePromises);
		}).done(mages => {
			this.setState({
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	onUpdate(rel, newRel) {
		client({
			method: 'PUT',
			path: rel.entity._links.self.href,
			entity: newRel,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': rel.headers.Etag
			}
		}).done(response => {
			this.loadFromServer(this.state.pageSize);
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					rel.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}
	
	onCreateREF(newRel, rel) {
		followApi([rel]).then(relCollection => {
			return client({
				method: 'POST',
				path: relCollection.entity._links.self.href,
				entity: newRel,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return followApi([{rel: rel, params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	/*
	onCreate(newMage) {
		followApi(['mages']).then(mageCollection => {
			return client({
				method: 'POST',
				path: mageCollection.entity._links.self.href,
				entity: newMage,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return followApi([{rel: 'mages', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	*/
	onDelete(rel) {
		client({method: 'DELETE', path: rel.entity._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}	
	/*
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(mageCollection => {
			this.setState({
				mages: mageCollection.entity._embedded.mages,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: mageCollection.entity._links
			});
		});
	}
	*/
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(mageCollection => {
			this.links = mageCollection.entity._links;

			return mageCollection.entity._embedded.mages.map(mage =>
					client({
						method: 'GET',
						path: mage._links.self.href
					})
			);
		}).then(magePromises => {
			return when.all(magePromises);
		}).done(mages => {
			this.setState({
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}
	

	render() {
		return (
			<div>
				<h1>Mage UI (<span>A demo project by Samuel Biou</span>)</h1>
				
				<p>This interface give an easy understable of the mage's' world.</p>
				<div>
	                <h2>List of mages</h2>
	                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreateREF}/>
					<MageList mages={this.state.mages}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  attributes={this.state.attributes}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
	            </div>
	            <AppEquipement/>            
            </div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)