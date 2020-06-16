import React, { useState, useEffect } from 'react';
import api from './api';
import Header from './header';
import { 
    Container, 
    Table, 
    TableRow, 
    TableHead,
    TableBody,
    TableCell,  
    Dialog, 
    Button, 
    DialogTitle, 
    DialogContent,
    DialogContentText, 
    TextField,
    DialogActions } from '@material-ui/core';
import './style.css';


function App() {

    const [ lista, setLista ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ cidade, setCidade] = useState('');
    const [ pais, setPais] = useState('');

    function loadData() {
        api.get('/viagem').then((response) => {
            const itens = response.data;
            setLista(itens);
        })
    }

    useEffect(() => loadData(), []);

    const openModal = () => setOpen(true);

    const closeModal = () => setOpen(false);

    //Função para adicionar uma nova viagem
    function addViagem() { 
        const city = cidade;
        const country = pais;
        api.post('/viagem', { cidade: city, pais: country}).then((response) => {
        setCidade('');
        setPais('');
        setOpen(false);
        loadData()
        })
     }

     //Função para marcar uma viagem como 'Não gostei'
    function markAsGostei(id, gostei) {
        if(gostei === true){
            api.patch(`/viagem/${id}/naogostei`).then((response) => {
                loadData()
            });
        } else {
                api.patch(`/viagem/${id}/gostei`).then((response) => {
                loadData()
            });
        }
    }


    //Função para excluir uma viagem da lista.
     function deleteViagem(id) {
         api.delete(`/viagem/${id}`).then((response) => {
            loadData()
         })
     }


    return (
        <>
        <Header />
        <Container maxWidth="lg" className="container">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Cidade</TableCell>
                        <TableCell>País</TableCell>
                        <TableCell>Gostei</TableCell>
                        <TableCell>Apagar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lista.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.cidade}</TableCell>
                            <TableCell>{item.pais}</TableCell>
                            <TableCell>
                                <input type="checkbox" 
                                onChange={() => markAsGostei(item.id, item.gostei)}                   
                                checked={item.gostei === true ? true : false}/>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" size="small" color="secondary" onClick={() => deleteViagem(item.id)} >Apagar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button 
                onClick={openModal}
                variant="contained" 
                color="primary" 
                style={{marginTop: '20px'}}>
                Adicionar
            </Button>
            </Container>
            <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Nova Viagem</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite a viagem que gostaria adicionar.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="cidade"
                        label="Cidade"
                        type="text"
                        fullWidth
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="pais"
                        label="Pais"
                        type="text"
                        fullWidth
                        value={pais}
                        onChange={e => setPais(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={addViagem} color="primary">
                        Salvar
                    </Button>
                 </DialogActions>
            </Dialog>
        </>
    );

}

export default App;
