function status(request, response) {
  response.status(200).json({
    chave: "media",
  });
}

export default status;
