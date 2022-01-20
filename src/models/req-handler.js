const handleReqWithUrl = async (func, req) => {
    const {url} = req.query
    if (!url) {
        return 'Не передал url в query'
    } else {
        const ans = await func(url)
        return ans
    }
}

const handleReqWithUserId = async (func, req) => {
    const {userId} = req.cookies

    if (!userId) {
        return 'Не передал куку с userId'
    } else {
        const ans = await func(userId)
        return ans
    }
}

const handleReqWithUserIdAndUrl = async (func, req) => {
    const {url} = req.query
    const {userId} = req.cookies

    if (!url || !userId) {
        return 'Не передал url или куку с userId'
    } else {
        await func(userId, url)
        return 'опперация выполнена'
    }
}

module.exports = {
    handleReqWithUrl,
    handleReqWithUserId,
    handleReqWithUserIdAndUrl
}

