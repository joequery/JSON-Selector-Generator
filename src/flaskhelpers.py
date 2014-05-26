def extract_post_data(request, required_fields):
    '''
    Returns (data,errors) tuple. errors is false upon success

    Example usage:

    >>> @app.route('/process', methods=['POST'])
    >>> def process():
        >>> required_fields = ('username', 'password')
        >>> data,errors = extract_post_data(request, required_fields)
        ...
        >>> return render_template("home.html", data=data)
    '''
    errors = {}
    form = request.form
    missing_fields = [x for x in required_fields if form.get(x) in [None, ""]]

    if missing_fields:
        errors['missing'] = missing_fields
        errors['message'] = "Fields are missing: %s" % ", ".join(missing_fields)
        return (False, errors)

    return (form, errors)


