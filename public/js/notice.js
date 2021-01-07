if (document.querySelector('.notice__alert')) {
  document.querySelector('.notice__alert button').addEventListener('click', () => {
    const noticeBlock = document.querySelector('.notice__alert')
    document.querySelector('.section').removeChild(noticeBlock)
  })
}
