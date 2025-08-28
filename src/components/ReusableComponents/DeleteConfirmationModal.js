import { Component } from 'react';
import { Modal, Button, Input } from 'antd';

class DeleteConfirmationModal extends Component {
  state = {
    loadingConfirm: false,
    visible: false,
    title: "",
    content: "",
    okText: "",
    cancelText: "",
    onCancel: function () { },
    onOk: function () { },
    okDisabled: false,
    input: '',
  }

  handleDeleteInput = e => this.setState({ input: e.target.value });

  displayModal = ({
    title = "",
    content = "",
    okText = "",
    cancelText = "",
    onCancel = function () { },
    onOk = function () { },
  }) => {
    this.setState({
      visible: true,
      title,
      content,
      okText,
      cancelText,
      onCancel,
      onOk,
      okDisabled: false,
      input: '',
    });
  }

  handleConfirm = () => {
    if (this.state.loadingConfirm) return;
    const { onOk } = this.state;
    this.setState({ loadingConfirm: true }, () => {
      onOk()
        .then(() => {
          this.setState({ loadingConfirm: false, visible: false });
        });
    });
  }
  handleCancel = () => {
    if (this.state.loadingConfirm) return;
    const { onCancel } = this.state;
    onCancel();
    this.setState({ visible: false });
  }


  render() {
    const { input, visible, loadingConfirm, title, okText, cancelText, okDisabled, content } = this.state;

    return (
      <Modal
        visible={visible}
        wrapClassName='confirmation-popup-wrap'
        title={title}
        confirmLoading={loadingConfirm}
        centered
        onCancel={this.handleCancel}
        footer={[
          <Button key="close" disabled={loadingConfirm} onClick={this.handleCancel}>
            {cancelText}
          </Button>,
          <Button key="ok" disabled={okDisabled || input !== "delete this venue/Restaurant"} loading={loadingConfirm} type={"danger"} onClick={this.handleConfirm}>
            {okText}
          </Button>
        ]}
      >
        <div>{content}</div>
        <p style={{ paddingTop: 12 }}>
          To confirm this action, please enter "<strong>delete this venue/Restaurant</strong>" on the following field:
        </p>
        <Input onChange={this.handleDeleteInput} value={this.state.input}/>
      </Modal>
    );
  }
}

export default DeleteConfirmationModal;