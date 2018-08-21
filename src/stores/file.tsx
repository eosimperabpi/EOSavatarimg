import { observable, action } from 'mobx'
import { fetchTx, fetchAvatar, doRemoveAvatar } from '../eosfilestore/core'
import { notificationStore } from '.';

// interface

class FileStore {
  @observable transactions = []
  @observable newTxid = ''
  @observable blob = ''
  @observable updatedAt = -1
  @observable fileMetadata = {
    block_time: '...',
    cpu_usage_us: '...',
    net_usage_words: '...',
    upload_by: '...',
  }
  @observable isLoading = false
  @observable counter = Number(location.href.split(/\//)[4]) || 1
  @observable isOk = true
  @observable isErrorState = false

  @action setTxid(txid: string) {
    this.newTxid = txid
    // async start here
  }

  @action removeAvatar() {
    doRemoveAvatar(this.newTxid).then((res: any) => {
      console.log(res)
      notificationStore.push({ message: 'Avatar removed' })
    })
  }

  @action fetchAvatar() {
    notificationStore.clear()
    fetchAvatar(this.newTxid).then((data: any) => {
      console.log('image blob', data)
      this.blob = data.avatar_data
      this.updatedAt = parseInt(data.updated_at, 10)
    }).catch((e) => {
      notificationStore.push({message: `Avatar not found for: ${this.newTxid}`})
    })
  }

  @action fetchData() {
    this.isLoading = true
    this.isErrorState = false
    this.blob = ''
    fetchTx(this.newTxid).then(({ data, fileMetadata }) => {
      console.log('ddd', data)
      this.blob = data.slice(9, )
      this.isLoading = false
      this.fileMetadata = fileMetadata
      console.log('f', fileMetadata)
      // window.open(data.slice(9,))
      // return false
      // const red = Base64.toByteArray(data)
      // window.open(data.slice(9,))
      // console.log(red)
      // exists()
    }).catch(e => {
      this.isLoading = false
      this.isErrorState = true
      notificationStore.push({ message: 'Error fetching tx via API' })
      console.error('ERROR: ', e)
    })
  }

  @action cleanTxid() {
    this.newTxid = ''
    this.blob = ''
  }

  @action setCounter(num: string) {
    this.counter += Number(num)
  }

  @action increment() {
    this.counter += 1
  }

}
export const fileStore = new FileStore()