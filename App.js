
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';
import axios from 'axios'
import Input from './Input'
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clientes: null,
      nomeCliente: null,
      CnpjCpf: null,
      funcao: false
    };
  }

  // componentDidMount = async () => {
  //   await this.GeraToken()
  // }

  GeraToken = async () => {
    if(this.state.CnpjCpf){
      try {
        const res = await axios.get('http://rest.grupomir.com.br:5000/GeraToken', {
          auth: {
            username: 'consigaz',
            password: 'consigaz@2019'
          }
        })
        // console.log(res.data.Token)
        axios.defaults.headers.common['token']
          = `${res.data.Token}`
  
      } catch (err) {
        console.log(err)
      }
  
      try {
        this.setState({funcao: true})
        const res = await axios.get(`http://rest.grupomir.com.br:5000/ConsultaContatos?cpfcnpj=${this.state.CnpjCpf}`)
        this.setState({funcao: false})
        // console.log('iniciando....')
        // console.log(res.data.Cliente.ClienteRetorno)
        this.setState({ clientes: res.data.Cliente.ClienteRetorno[0] })
        this.setState({CnpjCpf: ''})
      } catch (err) {
        console.log(err)
        // showError(err)
      }
    }else{
      Alert.alert('Informe o Numero do CPF/CNPJ')
    }

  }

  // getClientes = async (url) => {
  //   try {
  //     const res = await axios.get(`http://192.168.0.80:9980/ConsultaContatos?cpfcnpj=${url}`)
  //     console.log('iniciando....')
  //     console.log(res.data.Cliente.ClienteRetorno)
  //     this.setState({ clientes: res.data.Cliente.ClienteRetorno[0] })
  //   } catch (err) {
  //     console.log(err)
  //     // showError(err)
  //   }
  // }
  // 67945071000138


  render() {
    return (
      <View style={styles.container}>


        <View style={{ paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#A9A9A9' }}>

          <Input placeholder='CPF/CNPJ' icon='user'
            value={this.state.CnpjCpf}
            keyboardType='numeric'
            onChangeText={CnpjCpf => this.setState({ CnpjCpf })} />

          <Button
            onPress={this.GeraToken}
            title="Buscar Contatos"
          />
          {this.state.clientes ?
            <View style={{marginTop: 10}}>
              <Text><Text style={{ fontWeight: 'bold' }}>CPFCNPJ:</Text>{this.state.clientes.CPFCNPJ}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>cod-emitente:</Text>{this.state.clientes['cod-emitente']}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>nome-emit:</Text>{this.state.clientes['nome-emit']}</Text>
            </View> : <Text></Text>}

        </View>


         
        {this.state.clientes ?
          <FlatList data={this.state.clientes.ClienteContatoRetorno}
            keyExtractor={item => `${item.sequencia}`}
            renderItem={({ item }) =>
              <View style={styles.containerList}>
                <Text>{'Sequencia: ' + item.sequencia}</Text>
                <Text>{'Nome: ' + item.nome}</Text>
                <Text>{'Tipo: ' + item.tipo}</Text>
                <Text>{'E-mail: ' + item['e-mail']}</Text>
              </View>


            } >

          </FlatList> : <Text></Text>}
          {this.state.funcao ? <Text>Carregando...</Text> : <Text></Text>}
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerList: {
    paddingVertical: 10,
    // flexDirection: 'colunm',
    borderBottomWidth: 1,
    borderColor: '#AAA',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20
  },

});
