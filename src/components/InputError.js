const InputError = ({ messages = [], className = '' }) => (
    <>
        {messages.length > 0 ? (
            <>
                {messages.map((message, index) => (
                    <p
                        className={`${className} text-sm text-red-600`}
                        key={index}>
                        {message}
                    </p>
                ))}
            </>
        ) : (
            <p className={`${className} text-sm text-red-600`}>{'\xa0'}</p>
        )}
    </>
)

export default InputError
