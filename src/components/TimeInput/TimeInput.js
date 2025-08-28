import { Component } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Input, Form } from 'antd';
import moment from 'moment';

class TimeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 'h:mmA',
      inputValue: '',
      timeValue: null,
      validateStatus: '',
    };
  }

  getSnapshotBeforeUpdate = (prevProps) => {
    if (moment(prevProps.value).format('h:mmA') !== moment(this.props.value).format('h:mmA')) {
      return 'changed';
    }
    return null;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot === 'changed') {
      this.setState({
        inputValue: this.props.value ? moment(this.props.value).format(this.state.format) : '',
        timeValue: this.props.value ? moment(this.props.value) : null,
      });
    }
  }

  componentDidMount() {
    if (this.props.timeValue) {
      this.setState({
        inputValue: this.props.asFormat
          ? moment(this.props.timeValue, 'h:mm a').format(this.state.format)
          : moment(this.props.timeValue).format(this.state.format),
        timeValue: this.props.asFormat
          ? moment(this.props.timeValue, 'h:mm a')
          : moment(this.props.timeValue),
      });
    } else if (this.props.value) {
      this.setState({
        inputValue: moment(this.props.value).format(this.state.format),
        timeValue: moment(this.props.value),
      });
    }
  }

  resetInput = () => {
    this.setState({
      inputValue: '',
      timeValue: null,
      validateStatus: '',
    });
    if (typeof this.props.handleFormChange === 'function') {
      this.props.handleFormChange(null);
    }
  };

  validateTimeInput = (inputValue) => {
    const justNumbers = inputValue.toLowerCase().replace(/[^\d:]/g, '');
    const hours = justNumbers.split(':')[0];
    const minutes = justNumbers.split(':').length > 1 ? justNumbers.split(':')[1] : undefined;

    let changeInputValue = true;
    if (hours) {
      if (!minutes) {
        if (hours.length <= 2 && parseFloat(hours) > 24) {
          changeInputValue = false;
        } else if (hours.length === 3 && parseFloat(hours) > 240) {
          changeInputValue = false;
        } else if (hours.length >= 4 && parseFloat(hours.slice(0, 4)) > 2359) {
          changeInputValue = false;
        }
      } else {
        // Si existe "minutes" es porque se escribió ":"
        if (parseFloat(hours.slice(0, 2)) >= 24 && parseFloat(minutes.slice(0, 2)) > 0) {
          changeInputValue = false;
        } else if (parseFloat(hours.slice(0, 2)) < 24 && parseFloat(minutes.slice(0, 2)) >= 60) {
          changeInputValue = false;
        } else if (parseFloat(hours.slice(0, 2)) > 24 && parseFloat(minutes.slice(0, 2)) >= 0) {
          changeInputValue = false;
        }
      }
    } else {
      changeInputValue = false;
    }
    return { inputValue, changeInputValue };
  };

  handleOnChange = (e) => {
    const { inputValue, changeInputValue } = this.validateTimeInput(e.target.value);
    this.setState({
      inputValue,
      validateStatus: changeInputValue ? '' : 'warning',
    });
  };

  handleOnBlur = (e) => {
    if (!e.target.value || this.state.validateStatus === 'warning') {
      this.resetInput();
      // Función que pasas para putear
      // Para borrar hora
      if (this.props.handleTimeChange && !e.target.value && this.props.timeValue) {
        this.props.handleTimeChange(null);
      }
    } else {
      let inputValue = e.target.value
        .toLowerCase() // Pasando todo a minúsculas.
        .replace(/\s/g, '') // Quitando todos los espacios.
        .replace(/[^\d:pa]/g, '') // Quitando todos los caracteres que no sean un número, "a",p",":".
        .replace(/^(:||a||p)+/, '') // Si el input empieza con "a","p" o ":", quitar esos caracteres.
        .replace(/:+$/, '') // Si el input termina con ":", quitar ese ":".
        .replace(/:\D*:\D*(?=\d)/, ':') // Si existe un ":" entre números, el único caracter que puede estar entre números es ":".
        .replace(/:(?=\D+$)/, '') // Si existe un ":" entre un caracter numérico y un caracter no numérico, quitar ese ":".
        .replace(/(?!\d)p(\D*$)/, 'pm') // Si el input termine en un caracter no numérico, solo puede terminar en "a" o "p" (Posteriormente le agrego el "m" para que sea "am" "pm").
        .replace(/(?!\d)a(\D*$)/, 'am') // Si el input termine en un caracter no numérico, solo puede terminar en "a" o "p" (Posteriormente le agrego el "m" para que sea "am" "pm").
        .replace(/(?!\d)\D+(?=\d)/, ':'); // Si un grupo con al menos un caracter no numérico se encuentra entre dos números, ese grupo deberá ser reemplazado por ":".

      // Buscamos si el input tiene "am" o "pm" para guardar esa información y limpiarlo del inputValue.
      let hours = 0;
      let minutes = 0;
      let formatA = inputValue.includes('am') ? 'am' : inputValue.includes('pm') ? 'pm' : '';
      inputValue = inputValue.replace(/(p||a)+m/, '');

      // Si tiene un separador de horas/minutos (":"), los formatos se dividen en Horas y Minutos:
      // Horas:
      // length === 1: del 0 al 9
      // length === 2: del 0 al 24
      // Minutos:
      // length === 1: del 0 al 9
      // length === 2: del 0 al 59
      // Si no tiene un separador de horas/minutos (":"), los formatos posibles son los siguientes:
      // length === 1: del 0, 1, 2...8, 9
      // length === 2: del 0 al 24
      // length === 3: del 0 al 240
      // length === 4: del 0, 1, ..., 1059, ..., 1159, ..., 1259, ..., 2359, 2400
      if (inputValue.includes(':')) {
        hours = parseFloat(inputValue.split(':')[0].slice(0, 2));
        hours = hours === 24 ? 0 : hours;
        minutes =
          inputValue.split(':')[1] === '' ? 0 : parseFloat(inputValue.split(':')[1].slice(0, 2));
      } else {
        // Forzamos que solo tenga 4 de length, ya que el número máximo de números para las horas y minutos es 2, respectivamente.
        inputValue = inputValue.slice(0, 4);
        if (inputValue.length === 1) {
          hours = parseFloat(inputValue);
        } else {
          hours =
            parseFloat(inputValue.slice(0, 2)) === 12 ? 0 : parseFloat(inputValue.slice(0, 2));
          minutes = inputValue.slice(2) === '' ? 0 : parseFloat(inputValue.slice(2));
        }
      }

      // En caso el input tenga horas mayor a 12 pero se puso "am" al final, lo que manda son las horas => omitir el "am" (EJ: 14am => 14)
      if (formatA === 'am' && hours > 12) {
        formatA = '';
      }

      // Pasando de 24H a 12H (13:00 => 1:00pm) o (16:00pm => 4:00pm) o (8:00 => 8:00am)
      if (hours > 12 && formatA === 'pm') {
        hours -= 12;
      } else if (hours === 12 && formatA === 'am') {
        hours = 0;
      }

      if (formatA === '' && hours > 12) {
        hours -= 12;
        formatA = 'pm';
      } else if (formatA === '' && hours <= 12) {
        formatA = 'am';
      }

      inputValue = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}${formatA.toUpperCase()}`;

      // Función que pasas para putear (mp y mpt)
      if (this.props.handleTimeChange) {
        if (this.props.asFormat) {
          this.props.handleTimeChange(moment(inputValue, 'h:mmA').format('h:mmA'));
        } else {
          this.props.handleTimeChange(moment(inputValue, 'h:mmA'));
        }
      }

      this.setState({ inputValue, timeValue: moment(inputValue, 'h:mmA') });
      if (typeof this.props.handleFormChange === 'function') {
        this.props.handleFormChange(moment(inputValue, 'h:mmA'));
      }
    }
  };
  render() {
    const { style, noIcon, onForm } = this.props;
    return (
      <Form.Item
        noStyle
        validateStatus={this.state.validateStatus}
        style={{
          display: 'inline-block',
          margin: this.props.fromPopupMeal ? '-4px 0px' : 0,
          verticalAlign: 'initial',
        }}
      >
        <Input
          disabled={this.props.disabled}
          style={style ? { width: 150, ...style } : { width: 150 }}
          placeholder={this.props.placeholder || ''}
          value={this.state.inputValue}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          suffix={
            noIcon ? null : (
              <ClockCircleOutlined style={onForm ? { color: '#c2c2c2' } : { color: '#c2c2c2' }} />
            )
          }
        />
      </Form.Item>
    );
  }
}

export default TimeInput;
