export function useNotify({ root }) {
  const notify = (title, msg, type) => {
    if (type== 'success') {
      root.$toast.info(msg, {
        title,
        variant: type,
      })
    }else if (type== 'danger') {
      root.$toast.error(msg, {
        title,
        variant: type,
      })
    }else if (type== 'warning') {
      root.$toast.warning(msg, {
        title,
        variant: type,
      })
    } else {
      root.$toast(msg, {
        title,
        variant: type,
      })
    }
  }

  return { notify }
}

export default useNotify
