# Auto Render

### Steps for configuring a new instance.

- Ensure that the 'AutoRender' security group is assigned to the instance.
- Update the autorender.ventr.co.uk CNAME record to point to the instance's public DNS.
- Ensure that the heroku front end ENV variable is set to the appropriate domain (autorender.ventr.co.uk) and not the AWS public DNS.
