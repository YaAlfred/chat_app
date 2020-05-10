﻿import React from 'react';
import { FormGroup, Classes, Dialog, Button, RadioGroup, Radio } from "@blueprintjs/core";

class Logo extends React.Component{

    constructor(props){
        super();
        this.dataStore = props.store;
        const authorName = this.dataStore.getAuthorName();
        this.state = {
            authorName: authorName,
            gender: undefined,
            inputName: authorName,
            isDialogOpen: false,
            firstTimeOpen: false
        };
        this._updateInputName = this._updateInputName.bind(this);
        this._updateAuthorName = this._updateAuthorName.bind(this);
        this._showChangeNameDialog = this._showChangeNameDialog.bind(this);
        this._saveAndClose = this._saveAndClose.bind(this);
        this._cancelAndClose = this._cancelAndClose.bind(this);
        this._closeChangeNameDialog = this._closeChangeNameDialog.bind(this);
    }

    componentWillMount() {
        this.dataStore.on('authorChanged', this._updateAuthorName);
        this.dataStore.on("showChangeAuthorDialog", () => this._showChangeNameDialog(true));
    }

    _updateInputName(inputName) {
        this.setState({inputName});
    }

    _updateAuthorName(authorName) {
        this.setState({authorName});
        this._updateInputName(authorName);
    }

    _showChangeNameDialog(firstTimeOpen = false) {
        this.setState({ isDialogOpen: true, firstTimeOpen });
        setTimeout(() => {
            let nameInput = document.getElementsByClassName('nameInput');
            if(nameInput && nameInput.length > 0) {
                nameInput[0].focus();
                nameInput[0].select();
            }
        });
    }

    _handleGenderChange(gender) {
        this.setState({gender});
        this.dataStore.setAuthorGender(gender);
    }

    _cancelAndClose() {
        this._updateAuthorName(this.state.authorName);
        this._closeChangeNameDialog();
    }

    _saveAndClose(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (this.state.inputName && this.state.inputName.trim().length > 0) {
            this.dataStore.setAuthorName(this.state.inputName);
            this._closeChangeNameDialog();
        } else {
            console.log("Имя не может быть пустым!");
        }
    }

    _closeChangeNameDialog() {
        this.setState({ isDialogOpen: false });
        setTimeout(() => {
            let messageInput = document.getElementsByClassName("messageInput");
            if (messageInput) {
                messageInput[0].focus();
                messageInput[0].select();
            }
        })
    }

    render() {
        return (
            <div className="header">
                <div className="Logo" />
                <FormGroup className="user-info">
                    <p>Вы вошли как: {this.state.authorName} </p>
                    <Button icon="edit" onClick={() => this._showChangeNameDialog()} class="bp3-button" type="submit">Сменить ник</Button>
                </FormGroup>
                <Dialog title="Введите ваше имя и пол" usePortal={true} canOutsideClickClose={!this.state.firstTimeOpen} canEscapeKeyClose={!this.state.firstTimeOpen} isCloseButtonShown={!this.state.firstTimeOpen} onClose={this._closeChangeNameDialog} isOpen={this.state.isDialogOpen}>
                    <form  onSubmit={this._saveAndClose}>
                        <div className={Classes.DIALOG_BODY}>
                            <RadioGroup
                                label="Кто вы?"
                                onChange={(input) => this._handleGenderChange(input.target.value)}
                                selectedValue={this.state.gender}
                            >
                                <Radio label="Парень" value="male" />
                                <Radio label="Девушка" value="female" />
                            </RadioGroup>
                            <label >Ваше Имя:</label>
                            <input className="shout_box nameInput bp3-input" value={this.state.inputName} onChange={(input) => this._updateInputName(input.target.value)} type="text"/>
                        </div>
                        <div className={Classes.DIALOG_FOOTER}>
                            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                <Button disabled={this.state.firstTimeOpen} onClick={this._cancelAndClose}>Отмена</Button>
                                <Button onClick={this._saveAndClose}>Сохранить</Button>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </div>
        );
    }
}

module.exports = Logo;
