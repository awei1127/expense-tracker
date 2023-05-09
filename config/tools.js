module.exports = {
  getToday: function () {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = ('0' + (today.getMonth() + 1)).slice(-2)
    const dd = ('0' + today.getDate()).slice(-2)
    return `${yyyy}-${mm}-${dd}`
  },
  formatDate: function (date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    return `${year}-${month}-${day}`
  }
}